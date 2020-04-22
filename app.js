'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString =>
{
	const columns = lineString.split(',');
	const year = parseInt(columns[0]);
	const prefecture = columns[1];
	const popu = parseInt(columns[3]);
	if (year === 2010 || year === 2015)
	{
		let value = prefectureDataMap.get(prefecture);
		if (!value)
		{
			value = {
				popu10: 0,
				popu15: 0,
				change: null
			};
		}
		if (year === 2010)
		{
			value.popu10 = popu;
		}
		if (year === 2015)
		{
			value.popu15 = popu;
		}
		prefectureDataMap.set(prefecture, value);
	}
});
rl.on('close', () =>
{
	for (let [key, value] of prefectureDataMap)
	{
		value.change = value.popu15 / value.popu10;
	}
	const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) =>
	{
		return pair1[1].change - pair2[1].change; //逆順
	});

	var rankingArrayMap = rankingArray.map(([key, value], i) => 
	{
		//mapの第一引数はここではリストにして入れている、第二引数を渡すと「要素の添字」
		//Array の map 関数に渡す無名関数は、第二引数も書くと、各要素の添字も取得できます。
		console.log(key, value);
		return (
			key + ': Rnak_' + i + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' +
			value.change
		);
	});
	console.log(rankingArrayMap);

});