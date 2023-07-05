Array.prototype.avarage = function() {
    return this.length ?  this.reduce((a, b) => a + b, 0) / this.length : 0 ;
}

const a = []
a.push(1)

for (let i in a){
    console.log(i)
}