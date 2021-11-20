CONFIGURATION=""
FRONT_END_VERSION=0.1.0-SNAPSHOT

.PHONY: build
build:
	echo Configuration: ${CONFIGURATION}

	echo "// Generated by Makefile" > src/version.ts
	echo "export const version = { number: '${FRONT_END_VERSION}', build_date: '$(shell date +"%Y-%m-%dT%H:%M:%S%z")' }" >> src/version.ts

	docker build -t vocabulary_front_end --build-arg CONFIGURATION=${CONFIGURATION} .

.PHONY: run_container
run_container:
	docker network create -d bridge vocabulary || :
	docker run --rm --network="vocabulary" -it -p 4200:80 vocabulary_front_end

.PHONY: publish
publish:
	docker tag vocabulary_front_end robertradnai/vocabulary_front_end:${FRONT_END_VERSION}
	docker push robertradnai/vocabulary_front_end:${FRONT_END_VERSION}
