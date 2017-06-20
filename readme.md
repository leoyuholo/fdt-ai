# FDT AI coding test

## Requirement
Need (Node.js)[https://nodejs.org/en/] to be installed.

## Usage
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

## Example
In the project directory,
```
./index.js < ./testcases/0/in > ./testcases0.out
```
is equivalent to
```
./index.js -i ./testcases/0/in -o ./testcases0.out
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
And output TSV as well, but without header column:
```
AAA	96.48
BBB	-252.96
```

## Development
You can utilize the scripts in `package.json` to further develop this project.

- To run test, run `npm run test`.
- To lint code, run `npm run lint`.
- To run coverage, run `npm run coverage` and check the generated `coverage/lcov-report` directory.
- To watch file changes and run test automatically, run `npm run test-watch`
