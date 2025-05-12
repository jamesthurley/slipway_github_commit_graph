publisher := "jamesthurley"
name := "github_commit_graph"

build: assemble && package
build-ci: assemble && package-ci

assemble:
  rm -rf components
  mkdir -p components/{{publisher}}.{{name}}
  cp -r src/* components/{{publisher}}.{{name}}

package:
  slipway package components/{{publisher}}.{{name}}

package-ci:
  docker run --rm -v "$(pwd)/components":/workspace -w /workspace slipwayhq/slipway:latest slipway package {{publisher}}.{{name}}

release version:
  git tag -a "{{version}}" -m "Release {{version}}"
  git push origin "{{version}}"
