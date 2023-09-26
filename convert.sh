#!/bin/bash

tensorflowjs_converter \
  --input_format=tf_saved_model \
  --output_node_names='StatefulPartitionedCall/sequential/dense_1/BiasAdd/ReadVariableOp' \
  --saved_model_tags=serve \
  ./ \
  ./web_app/web_model