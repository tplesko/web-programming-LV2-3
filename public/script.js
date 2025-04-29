let svaVremena = [];

document.getElementById('filter-temp-min').addEventListener('input', function () {
    document.getElementById('temp-min-value').textContent = this.value;
});

document.getElementById('filter-temp-max').addEventListener('input', function () {
    document.getElementById('temp-value').textContent = this.value;
});


// Event listener za gumb
document.getElementById('filter-gumb').addEventListener('click', filtriraj);


fetch('vrijeme.csv')
    .then(res => res.text())
    .then(csv => {
        rezultat = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });

        svaVremena = rezultat.data.map(vrijeme => ({
            ID: vrijeme.ID,
            temperatura: Number(vrijeme.Temperature),
            vlaznost: Number(vrijeme.Humidity),
            brzina_vjetra: Number(vrijeme["Wind Speed"]),
            opad: Number(vrijeme["Precipitation (%)"]),
            oblacnost: vrijeme["Cloud Cover"],
            atmosfera: Number(vrijeme["Atmospheric Pressure"]),
            uv_index: Number(vrijeme["UV Index"]),
            sezona: vrijeme.Season,
            vidljivost: Number(vrijeme["Visibility (km)"]),
            lokacija: vrijeme.Location,
            vrsta_vremena: vrijeme["Weather Type"]
        }))
    
        const prvih_15 = svaVremena.slice(0, 15);
        prikaziTablicu(prvih_15);
        prikaziPocetnuTablicu(prvih_15);
    })

function prikaziPocetnuTablicu(vremena) {
    const tbody = document.querySelector("#filter-tablica tbody");
    tbody.innerHTML = '';

    for (const vrijeme of vremena) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vrijeme.temperatura}</td>
            <td>${vrijeme.vlaznost}</td>
            <td>${vrijeme.brzina_vjetra}</td>
            <td>${vrijeme.opad}</td>
            <td>${vrijeme.oblacnost}</td>
            <td>${vrijeme.atmosfera}</td>
            <td>${vrijeme.uv_index}</td>
            <td>${vrijeme.sezona}</td>
            <td>${vrijeme.vidljivost}</td>
            <td>${vrijeme.lokacija}</td>
            <td>${vrijeme.vrsta_vremena}</td>
        `;
        tbody.appendChild(row);
    }
}

function prikaziTablicu(vremena) {
    const tbody = document.querySelector('#vremena-tablica tbody');
    tbody.innerHTML = ''; //ocisti ako postoji

    for (const vrijeme of vremena) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vrijeme.temperatura}</td>
            <td>${vrijeme.vlaznost}</td>
            <td>${vrijeme.brzina_vjetra}</td>
            <td>${vrijeme.opad}</td>
            <td>${vrijeme.oblacnost}</td>
            <td>${vrijeme.atmosfera}</td>
            <td>${vrijeme.uv_index}</td>
            <td>${vrijeme.sezona}</td>
            <td>${vrijeme.vidljivost}</td>
            <td>${vrijeme.lokacija}</td>
            <td>${vrijeme.vrsta_vremena}</td>
        `;
        tbody.appendChild(row);
    }
}

function prikaziFiltriranaVremena(vremena) {
    const tabela = document.getElementById("filter-tablica");
    const thead = tabela.querySelector("thead");
    const tbody = tabela.querySelector("tbody");

    // Resetiraj prethodne podatke
    tbody.innerHTML = '';
    thead.innerHTML = '';

    if (vremena.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12">Nema podataka koji odgovaraju filtru</td></tr>';
        return;
    }

    // Dinamičko zaglavlje
    thead.innerHTML = `
        <tr>
            <th>Temperatura</th>
            <th>Humidity</th>
            <th>Wind Speed</th>
            <th>Precipitation</th>
            <th>Cloud Cover</th>
            <th>Atmospheric Pressure</th>
            <th>UV Index</th>
            <th>Season</th>
            <th>Visibility</th>
            <th>Location</th>
            <th>Weather Type</th>
            <th></th>
        </tr>
    `;

    for (const vrijeme of vremena) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vrijeme.temperatura}</td>
            <td>${vrijeme.vlaznost}</td>
            <td>${vrijeme.brzina_vjetra}</td>
            <td>${vrijeme.opad}</td>
            <td>${vrijeme.oblacnost}</td>
            <td>${vrijeme.atmosfera}</td>
            <td>${vrijeme.uv_index}</td>
            <td>${vrijeme.sezona}</td>
            <td>${vrijeme.vidljivost}</td>
            <td>${vrijeme.lokacija}</td>
            <td>${vrijeme.vrsta_vremena}</td>
            <td><button class="btn-plan" onclick='dodajUPlan(${JSON.stringify(vrijeme)})'>Dodaj </button></td>
        `;
        tbody.appendChild(row);
    }
}


document.getElementById('filter-gumb').addEventListener('click', filtriraj);

function filtriraj() {
    const season = document.getElementById('filter-season').value.trim().toLowerCase();
    const lokacijaInput = document.getElementById('filter-lokacija').value.trim().toLowerCase();
    const minTemp = Number(document.getElementById('filter-temp-min').value);
    const maxTemp = Number(document.getElementById('filter-temp-max').value);

    const filtriranaVremena = svaVremena.filter((vrijeme) => {
        const vrijemeSezona = vrijeme.sezona?.trim().toLowerCase();
        const vrijemeLokacija = vrijeme.lokacija?.trim().toLowerCase();
        const temperatura = vrijeme.temperatura;

        const prolaziSezona = !season || vrijemeSezona === season;
        const prolaziLokacija = !lokacijaInput || vrijemeLokacija.includes(lokacijaInput);
        const prolaziTemperatura = temperatura >= minTemp && temperatura <= maxTemp;

        return prolaziSezona && prolaziLokacija && prolaziTemperatura;
    });

    prikaziFiltriranaVremena(filtriranaVremena.slice(0, 15));
}


let plan = [];

document.getElementById('plan-toggle').addEventListener('click', () => {
  document.getElementById('plan-sidebar').classList.toggle('show');
});

function dodajUPlan(vrijeme) {
  if (plan.find(v => v.ID === vrijeme.ID)) return;

  plan.push(vrijeme);
  prikaziPlan();
}

function prikaziPlan() {
  const tbody = document.querySelector('#plan-tablica tbody');
  tbody.innerHTML = '';

  plan.forEach((dan, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${dan.ID}</td>
      <td>${dan.temperatura}°C</td>
      <td>${dan.lokacija}</td>
      <td>${dan.vrsta_vremena}</td>
      <td><button class="plan-remove-btn" onclick="ukloniIzPlana(${index})">✖</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function ukloniIzPlana(index) {
  plan.splice(index, 1);
  prikaziPlan();
}

document.getElementById('potvrdi-plan').addEventListener('click', () => {
    if (plan.length === 0) {
      alert("Plan je prazan! Dodajte barem jedan dan prije potvrde.");
      return;
    }
  
    alert(`Uspješno ste isplanirali ${plan.length} dana za aktivnosti na otvorenom!`);
  
    // Isprazni plan
    plan = [];
    prikaziPlan();
  
    // Resetiraj filtere
    resetirajFiltere();
  
    // Prikaži početnih 15 redaka
    prikaziFiltriranaVremena(svaVremena.slice(0, 15));
  });
  

function resetirajFiltere() {
    document.getElementById('filter-season').value = '';
    document.getElementById('filter-lokacija').value = '';
    document.getElementById('filter-temp-min').value = 0;
    document.getElementById('filter-temp-max').value = 40;
    document.getElementById('temp-min-value').textContent = '0';
    document.getElementById('temp-value').textContent = '40';
  }
  
    
