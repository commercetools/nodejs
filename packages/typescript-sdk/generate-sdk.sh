#!/bin/bash

# to install the rmf-codegen please refer to https://github.com/commercetools/rmf-codegen#install-rmf-codegen-cli
rmf-codegen generate $API_RAML_FILE -o src/generated -t typescript_client -s shared -m models -c client