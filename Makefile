REPORTER = spec

test:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \

test-w:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \
		--growl \
		--watch

.PHONY: test test-w