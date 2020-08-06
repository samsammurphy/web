// CommonJS
// module.exports = {
//     getOne: function () {
//         return fetch('http://api.icndb.com/jokes/random')
//             .then(res => res.json())
//             .then(data => data.value.joke);
//     }
// }

// ES2016
export const joke = {
    getOne: function () {
        return fetch('http://api.icndb.com/jokes/random')
            .then(res => res.json())
            .then(data => data.value.joke);
    }
}