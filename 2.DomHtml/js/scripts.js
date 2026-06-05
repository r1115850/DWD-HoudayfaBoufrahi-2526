// === Oefening 1: querySelector() ===
{
	console.log('\n%c=== querySelector ===', 'color: #0c0');
	const hdrTekoop = document.querySelector('#ex1-html h3');
   const imgVaas = document.querySelector('#ex1-html img');
   const ulkenmerken = document.querySelector('#ex1-html ul');
   const li = document.querySelector('#ex1-html li');
   const $0 = document.querySelector('#ex1-html span');
   const info = document.querySelector('#ex1-html a');
   const table = document.querySelector('#ex1-html table');

   console.log(hdrTekoop);
   console.log(imgVaas);
   console.log(ulkenmerken);
   console.log(li);
   console.log($0);
   console.log(info);
   console.log(table);
}

// === Oefening 2: querySelectorAll() ===
{
	console.log('\n%c=== querySelectorAll ===', 'color: #0c0');
   const items = document.querySelectorAll('#ex2-html .Items');
   console.log = ('Aantal elementen met class items: ${items.length}');

   items.forEach(item => {
      console.log(items.innerText);
   }); 
}

// === Oefening 3: addEventListener() ===
{
	console.log('\n%c=== addEventListener() ===', 'color: #0c0');

   // declaraties
   const btnTest1 = document.querySelector('#ex3 .btn-1');
   const btnTest2 = document.querySelector('#ex3 .btn-2');
   const btnTest3 = document.querySelector('#ex3 select');
   const btnTest4 = document.querySelector('#ex3 img');

	// event handler functies
   function btnTest1ClickHandler() {
      console.log('er is op button 1 geklikt');
   }

   function btnTest2ClickHandler() {
      console.log('er is op button 2 geklikt');
   }

   function btnTest3ClickHandler() {
      console.log('nieuwe waarde gekozen');
   }

   function btnTest4ClickHandler() {
      console.log('muis over de afbeelding');
   }

	// events koppelen
   btnTest1.addEventListener('click', btnTest1ClickHandler);

   btnTest2.addEventListener('click', btnTest2ClickHandler);

   btnTest3.addEventListener('click', btnTest3ClickHandler);

   btnTest4.addEventListener('click', btnTest4ClickHandler);

}

// === Oefening 4: innerHTML en innerText ===
{
	// DOBBELSTEEN OEFENING
   const btnKlik = document.querySelector('#ex4 button');
   const $0 = document.querySelector('#ex4 span');

   function btnKlikClickHandler() {
      $0.innerHTML = Math.floor(Math.random() * 6) + 1;
      console.log($0.innerHTML);
      console.log($0.innerText);
   }

   btnKlik.addEventListener('click', btnKlikClickHandler);

   // AANTAL TEKENS OEFENING

   // ... vul hier aan
}

// === Oefening 5: HTML-attributen lezen en schrijven ===
{
   const img = document.querySelector('#ex5 img');

   function imgClickHandler() {
      console.log('img.src');
      console.log('img.alt');
   }

   img.alt = 'nieuwe beschrijving';

   img.src = 'img/altsax.jpg';

   img.addEventListener('click', imgClickHandler);
}

// === Oefening 6: validatie tekstinvoer ===
{
   // ALLEEN LETTERS EN SPATIES OEFENING

   // ... vul hier aan

   // WACHWOORD VALIDATIE OEFENING

   // ... vul hier aan

}

// === Oefening 7: e.preventDefault() ===
{
   // ... vul hier aan

}

// === Oefening 8: e.target ===
{
   // ... vul hier aan

}

// === Oefening 9: event bubbling ===
{
   // ... vul hier aan

}

// === Oefening 10: formvalidatie ===
{
   // ... vul hier aan

}
