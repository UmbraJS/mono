# Moonbow

A lean, framework-agnostic WebGPU helper library extracted from the gpu app.

## Install

This package is part of the monorepo and linked via pnpm workspaces.

## Build

- pnpm -w run gpu (to run the demo app)
- pnpm -w --filter @umbrajs/moonbow build (to build this package)

## Usage

Import from your app:

import { useGPU, gpuCanvas, gpuPipeline, cube, plane } from '@umbrajs/moonbow'
