let memberNames = [
    'Sunita Abbasi',
    'Samuel Afon',
    'Stephen Alonso',
    'Earl Amematekpo',
    'Olumide Ayo',
    'Carllyn Barfi',
    'Julian Bertrand',
    'Saiyam Bhakta',
    'Erick Castro Melendez',
    'David Cohen',
    'Rishav Ranjan Dahal',
    'Derek Delgadillo-Valencia',
    'Nate Denton',
    'Brian Erhart',
    'Ruby Estrada',
    'Loredana Fouonji',
    'Michael Gomez',
    'Michael Haapasaari',
    'Arsema Habte',
    'Sterling Hardy',
    'Ethan Holley',
    'Muhammad Huq',
    'Sydney Kallus',
    'Safwat Khan',
    'Tyler Kilgore',
    'Ashlyn Kwasnica',
    'Gustan Lolendo',
    'Daniel Lopez',
    'Luke Marlin',
    'Derian Mendez',
    'Oscar Montemayor Rodriguez',
    'Brenden Morgan',
    'Joshua Munoz',
    'Justin Nguyen',
    'Raj Patel',
    'Sheen Patel',
    'Colton Perrin',
    'Kayden Plemons',
    'Prapti Pyakurel',
    'Jordyn Robinson',
    'Rowen Salazar',
    'Pablo Soliz',
    'Veronica Tawfik',
    'Yosan Tewolde',
    'Hema Thallapareddy',
    'Joshua Tran',
    'Joshua Vadala',
    'Syeda Zainab',
];

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    if(input.length){
        result = memberNames.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(result);
    }
    display(result);

    if(!result.length){
        resultsBox.innerHTML = '';
    }
}

function display(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });

    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectInput(list){
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
}