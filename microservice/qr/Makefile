dev:
	export $$(grep -v '^#' ../../secrets/.env | xargs) && quarkus dev

build_jvm:
	export $$(grep -v '^#' ../../secrets/.env | xargs) && ./gradlew build

init:
	gradle wrap