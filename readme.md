# FDT AI coding test
[![Build Status](https://travis-ci.org/leoyuholo/fdt-ai.svg?branch=master)](https://travis-ci.org/leoyuholo/fdt-ai)
[![Test Coverage](https://codeclimate.com/github/leoyuholo/fdt-ai/badges/coverage.svg)](https://codeclimate.com/github/leoyuholo/fdt-ai/coverage)

## Usage
**Prerequisite**: Need to have [Node.js](https://nodejs.org/en/) installed on system.

Run `npm install` or `yarn` to install dependencies first.

Run `index.js` directly or by `node index.js`. `-h` to show the following usage manuel.

```
  Usage: ./index.js [options]

  Options:

    -h, --help           output usage information
    -i, --input <path>   Input file
    -o, --output <path>  Output file
```

If input file option is not provided, it will read from `stdin` instead.

If output file option is not provided, it will write to `stdout` instead.

## Example usage
In the project directory,
```
./index.js < ./testcases/basic/in > ./testcases0.out
```
is equivalent to
```
./index.js -i ./testcases/basic/in -o ./testcases0.out
```

## Example input
This program expects TSV as input:
```
OrderId	Trader	StkCode	Quantity	Price	TradeType	Fee	Timestamp
1	AAA	222222	100	10	Buy	0.2	2016-05-09 13:38:24
2	BBB	333333	1000	8.8	Sell	10.56	2016-05-09 10:37:16
3	AAA	222222	100	11	Sell	1.32	2016-05-10 13:38:24
4	BBB	333333	800	9.0	Buy	1.6	2016-05-11 14:58:30
5	BBB	333333	400	9.2	Buy	0.8	2016-05-16 10:28:24
6	AAA	555555	600	15.5	Buy	2.0	2016-05-16 10:31:33
```
## Example output

And output TSV as well, but without header column:

```
AAA	96.48
BBB	-252.96
```

## Assumptions
1. Quantity must be positive integers.
2. When two traders have same profit(loss), tie break with alphabetical order of trader id.
3. Input are sorted in ascending order of OrderId.
4. OrderId is unique and determines the order sequence. An order with smaller OrderId than another order means the former arrives earlier than the latter, and should be processed first.

## Development
You can utilize the scripts in `package.json` to further develop this project.

- To run test, run `npm run test`.
- To lint code, run `npm run lint`.
- To run coverage, run `npm run coverage` and check the generated `coverage/lcov-report` directory.
- To watch file changes and restart automatically, run `npm run dev`
- To watch file changes and run test automatically, run `npm run test-watch`

To avoid inconsistent development environment, you are recommended to do development with [docker](https://store.docker.com/editions/community/docker-ce-server-ubuntu/plans/docker-ce-server-ubuntu-tier?tab=instructions) and [docker-compose](https://docs.docker.com/compose/install/) on Ubuntu.

To start development, simplily run `docker-compose up` to spin up the development environment. You may edit `docker-compose.yaml` to run different scripts.
