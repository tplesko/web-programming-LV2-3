let svaVremena = [];
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

function prikaziFiltriranaVremena(vremena){
    const tbody = document.querySelector("#filter-tablica tbody");
    tbody.innerHTML = '';

    
}

function filtriraj() {
    const season = document.getElementById('filter-season').value.trim().toLowerCase();

    const filtriranaVremena = svaVremena.filter(vrijeme => {
        const seasonMatch = !season || vrijeme.sezona.toLowerCase() === season;
        return seasonMatch;
    })
    prikaziFiltriranaVremena(filtriranaVremena);
}

document.getElementById('filter-gumb').addEventListener('click', filtriraj);

fetch('vrijeme.csv')
    .then(res => res.text())
    .then(csv => {
        const rezultat = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });

        const svaVremena = rezultat.data.map(vrijeme => ({
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
    
        const prvih_20 = svaVremena.slice(0, 20);
        prikaziTablicu(prvih_20);

    })


    
