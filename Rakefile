# frozen_string_literal: true

require "yaml"
require "set"

namespace :build_matrix do
  namespace :semaphore do
    task :generate do
      node_version = "16"
      yaml = YAML.load_file("build_matrix.yml")
      matrix = yaml["matrix"]
      semaphore = yaml["semaphore"]
      skipped_packages = Set.new

      build_block_name = "JavaScript with Node.js #{node_version} - build"
      build_block = build_semaphore_task(
        "name" => build_block_name,
        "dependencies" =>  ["Validation"],
        "task" => {
          "env_vars" => ["name" => "NODE_VERSION", "value" => node_version],
          "prologue" => {
            "commands" => [
              "cache restore",
              "mono bootstrap --ci",
              "cache store"
            ]
          },
          "jobs" => [
            build_semaphore_job(
              "name" => "Build",
              "commands" => [
                "mono build",
                "cache store $_PACKAGES_CACHE-packages-$SEMAPHORE_GIT_SHA-v$NODE_VERSION " \
                  "packages"
              ]
            )
          ]
        }
      )

      tests_block_name = "JavaScript - Tests"
      test_jobs = []
      matrix["packages"].each do |package|
        has_package_tests = package_has_tests?(package["path"])
        if !has_package_tests && skipped_packages.add?(package["package"])
          puts "DEBUG: Skipping JavaScript tests for #{package["package"]}: No tests files found"
        end

        package["variations"].each do |variation|
          variation_name = variation.fetch("name")
          dependency_specification = variation["packages"]
          update_package_version_command =
            if dependency_specification
              packages = dependency_specification.map do |name, version|
                "#{name}@#{version}"
              end.join(" ")
              "yarn add #{packages} --dev --ignore-workspace-root-check"
            end

          next unless has_package_tests

          test_jobs << build_semaphore_job(
            "name" => "#{package["package"]} - #{variation_name}",
            "commands" => ([
              update_package_version_command,
              "mono test --package=#{package["package"]}"
            ] + package.fetch("extra_commands", [])).compact
          )
        end
      end

      tests_block =
        build_semaphore_task(
          "name" => tests_block_name,
          "dependencies" => [build_block_name],
          "task" => {
            "env_vars" => [
              {
                "name" => "NODE_VERSION",
                "value" => node_version
              }
            ],
            "prologue" => {
              "commands" => [
                "cache restore",
                "cache restore $_PACKAGES_CACHE-packages-$SEMAPHORE_GIT_SHA-v$NODE_VERSION",
                "mono bootstrap --ci"
              ]
            },
            "jobs" => test_jobs
          }
        )

      builds = [build_block, tests_block]
      semaphore["blocks"] += builds

      header = "# DO NOT EDIT\n" \
        "# This is a generated file by the `rake build_matrix:semaphore:generate` task.\n" \
        "# See `build_matrix.yml` for the build matrix.\n" \
        "# Generate this file with `rake build_matrix:semaphore:generate`.\n"
      generated_yaml = header + YAML.dump(semaphore)
      File.write(".semaphore/semaphore.yml", generated_yaml)
      puts "Generated `.semaphore/semaphore.yml`"
      puts "Task count: #{builds.length}"
      puts "Jobs count: #{builds.sum { |block| block["task"]["jobs"].count }}"
    end

    task :validate => :generate do
      `git status | grep .semaphore/semaphore.yml 2>&1`
      if $?.exitstatus.zero? # rubocop:disable Style/SpecialGlobalVars
        puts "The `.semaphore/semaphore.yml` is modified. The changes were not committed."
        puts "Please run `rake build_matrix:semaphore:generate` and commit the changes."
        exit 1
      end
    end
  end
end

def build_semaphore_task(task_hash)
  {
    "name" => task_hash.delete("name") { raise "`name` key not found for task" },
    "dependencies" => [],
    "task" => task_hash.delete("task") { raise "`task` key not found for task" }
  }.merge(task_hash)
end

def build_semaphore_job(job_hash)
  {
    "name" => job_hash.delete("name") { "`name` key not found" },
    "commands" => []
  }.merge(job_hash)
end

def package_has_tests?(package)
  test_dir = File.join(package, "src/__tests__")
  # Has a dedicated test dir and it contains files
  return true if Dir.exist?(test_dir) && Dir.glob(File.join(test_dir, "**", "*.*s*")).any?

  Dir
    .glob(File.join(package, "**/*.test.*s"))
    .reject { |file| file.include?("/node_modules/") }
    .any?
end
