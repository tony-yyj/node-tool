const fs = require('fs');
const path = require('path');

const harPath = '/Users/tonyyang/Downloads/WOOFi DEX TERMS of USE.txt';


fs.readFile(harPath, 'utf-8', (err, res) => {
    const arr = res.trim().split('\n')
    const domArr = [];
    const titleReg = /^\d+\..+/;
    const liReg = /^\* /;
    for (const p of arr) {
        const text = p.trim();
        if (titleReg.test(text)) {
            domArr.push(`<h3>${text}</h3>`)
            continue;
        }
        if (liReg.test(text)) {
            domArr.push(`<li>${text}</li>`)
            continue;
        }

        domArr.push(`<p>${text}</p>`)


    }
    console.log(domArr.join('\n'))
})