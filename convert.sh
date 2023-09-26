#!/bin/bash

# check if tensorflowjs is installed
if ! [ -x "$(command -v tensorflowjs_converter)" ]; then
  pip install tensorflowjs
fi

tensorflowjs_converter \
  --input_format=tf_saved_model \
  --output_node_names='StatefulPartitionedCall/sequential/dense_1/BiasAdd/ReadVariableOp' \
  --saved_model_tags=serve \
  ./ \
  ./web_app/web_model