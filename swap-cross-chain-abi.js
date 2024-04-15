const { log } = require('console');
const fs = require('fs');
const path = require('path');

const filePath = '/Users/tonyyang/Downloads/testWOOFiDexCrossChainRouter.ts';

function matchQuote(str, testString, letQuote, rightQuote) {

    const index = str.indexOf(testString)
    console.log(index);

    let quote = 0;


    let i = index + testString.length;
    for (; i < str.length; i++) {
        if (str[i] === letQuote) {
            quote++;
        }
        if (str[i] === rightQuote) {
            quote--;
        }
        if (quote === 0) {
            break;
        }

    }

    console.log(i);

    return str.slice(index + testString.length, i + 1);
}

function writeInFile(str, name) {
    const targetFilePath = path.resolve(__dirname, 'abi', name);
    fs.writeFile(targetFilePath, str, (err) => {
        if (err) {
            console.log(err);
        }
    });
    

}


fs.readFile(filePath, 'utf-8', (err, res) => {
    const testString = 'configAbi = ';

    const configAbi = matchQuote(res, 'configAbi = ', '{', '}');

    const reg = /(\S+)Abi: /g;


    let matchResult;
    const obj = {};
    while ((matchResult = reg.exec(configAbi)) !== null) {
        // const [name,,{index:index}] = matchResult;
        const testString = matchResult[0];
        const name = matchResult[1];
        const index = matchResult.index;
        const abi = matchQuote(configAbi, testString, '[', ']');

        obj[name] = abi;
        writeInFile(abi, name + 'Abi.json')



        


    }
    console.log('obj', obj);



})