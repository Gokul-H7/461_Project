#!/bin/bash
arg1=$1
tsc cli.ts
node cli.js "$arg1"