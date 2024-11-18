let h = document.getElementById('h');
let m = document.getElementById('m');
let s = document.getElementById('s');
let tiempo = document.getElementById('tiempo');
let digitos = document.getElementsByClassName('t');

let hi = parseInt(h.innerText, 10); 
let mi = parseInt(m.innerText, 10); 
let si = parseInt(s.innerText, 10); 

console.log(tiempo);
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const reloj = async()=>{
    for(var x = hi; x>=0; x--){
        h.innerText=x;
        for(var y = mi; y>=0; y--){
            m.innerText=y;
            for(var z= si;z>=0; z-- ){
                s.innerText=z;
                await sleep(1000);

                if(x==0 && y==0 && z==0){
                    tiempo.replaceChildren(digitos);
                    let resultados = document.createElement("a");
                    resultados.innerText= "Ver resultados";
                    resultados.className = "btn";
                    resultados.href="/verResultado";
                    tiempo.innerText = "";
                    tiempo.appendChild(resultados); 
                }
            }
        }
    }
}

reloj();
