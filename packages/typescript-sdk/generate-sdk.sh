#!/bin/bash

rmf-codegen generate $API_RAML_FILE -o src/generated -t typescript_client -s shared -m models -c client