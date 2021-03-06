###############################################################################
# The source files need to be passed to Closure Compiler in dependency order,
# or else the output might contain statements that reference symbols that
# haven't been encountered yet.
###############################################################################
JS_HASH_SRC := md4.js md5.js rmd160.js sha1.js
JS_ALL_SRC  := $(addprefix hash/,$(JS_HASH_SRC)) dict.js otp.js main.js exports.js
JS_MINIFIED := jsotp.js

SRC_DIR := src
RELEASE_DIR := $(HOME)/public_html/jsotp

# The Closure Compiler JAR file (or a symlink to it) is assumed to exist in
# the current directory. Source code and pre-built binaries can be found at
# <http://code.google.com/closure/compiler/>.
CLOSURE_JAR := compiler.jar
MINIFY_FLAGS := --compilation_level ADVANCED_OPTIMIZATIONS # --warning_level VERBOSE
MINIFY := java -jar $(CLOSURE_JAR) $(MINIFY_FLAGS)

# Minify all the JavaScript files into a single output file.
jsotp:
	$(MINIFY) $(addprefix --js=$(SRC_DIR)/,$(JS_ALL_SRC)) --js_output_file=$(JS_MINIFIED)

release:
	rsync -a --exclude-from '.exclude_from_release' * $(RELEASE_DIR)

.PHONY: jsotp release
