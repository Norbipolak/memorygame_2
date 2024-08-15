import { useEffect } from "react";

function MemoryGame() {
    //mindig ennek az étrékét fogjuk négyzetre emelni, amikor új játékfelületet csinálunk 
    const [dimensions, setDimensions] = useState(4); //kezdőérték 4, mert 2*2-es lesz majd a grid 
    /*
    Ebbe töltünk majd bele objektumokat, amin végigmegyünk egy for-val 
    lesz az objektumban 3 mező 
    1. highlighted -> automatikusan majd egy random indexü mezőt kijelölünk, akkor fel fog villani valami, csinálunk egy osztályt css-ben rá,
         ha ennek az értéke true lesz 
    2. selected -> de viszont nem szeretnénk, hogy ez az animation tartson, amit a program random kiválaszott, akkor ugyanúgy ez a selected
        true lesz ugyanakkor és ez true is marad a highlighted-ot pedig majd levesszük, mert azt akarjuk, hogy az animation csak egyszer fusson 
        le, de viszont azt is akarjuk tudni, hogy melyiket választotta ki a játékos ezért ez true marad majd 
    3. userSelected -> majd kap egy olyat, hogy selected-well vagy selected-wrong és ezek is class-ok lesznek majd amit meg kap az a mező
    amit kiválaszott a játékos és ha jó, akkor kap egy selected-well class-t, ha meg rossz, akkor egy wrong-ot és pirosan meg zölden fog 
    vílágitani, aszerint, hogy melyik class-t kapja majd 
    */
    const [cells, setCells] = useState([]);
    /*
    ha olyan mezőre kattint rá a játékos, aminek a selected-je true volt, akkor tudjuk, hogy az a jó mező és ilyenkor megkapja a selected-well
    class-t és majd a pontjait is növeljük egyel 
    ha viszont rosszra kattink, akkor meg legenerálunk egy új játékot és a pontokat meg lenullázzuk!!! 
    */
    const [points, setPoints] = useState(0);
    /*
    Amikor fut az animation és megmutatjuk, hogy melyik cell-ek lesznek a helyesek, akkor nem szeretnénk, hogy az animation közben a játékos 
    rá tudjon kattintani a cell-re, csak, ha már végbement az animation és ezért kell ez a változó, ami true lesz és majd ha végbement 
    akkor false 
    */
    const [disableCells, setDisableCells] = useState(true);
    /*
    hogy tudjuk, hogy hányszor kattintott a játékos, mert ha annyiszor kattintott amennyi a dimension értéke, akkor tudjuk, hogy le kell 
    generálni egy új táblát, mert az összeset eltalálta 
    */
    const [hitCounter, setHitCounter] = useState(0);
    /*
    Ez arra lesz majd, hogy mutassuk-e a gombot alul, amivel új játékot tudunk majd kezdeni!! 
    */
    const [disableShow, setDisableShow] = useState(false);

    const rNumber = (from, to) => Math.floor(Math.random() * ((to - from) - 1) + from);

    /*
    itt generálunk annyi cell, amennyi éppen a dimension
    */
    const generateCells = () => {
        const cs = [];

        //itt kap majd minden egyes cell egy objektumot
        for (let i = 0; i < dimensions; i++)
            cs.push({ highlighted: false, selected: false, userSelected: "" });
        /*
        push-val minden egyes körben belerakunk egy objektumot és majd annyi objektum lesz mindig ebben a tömbben, mint amennyi a dimensions
        és a set-vel meg megadjuk a cell-es useState-s változónak azt a cs tömböt, amit itt csinltunk! 
        */

        setCells(cs);
    };

    /*
    Ki kell választani random pont gyök annyi random cell-át, mint amennyi a dimensions 
    Kibontjuk a cells-t useState-s (mindig amikor változás van, akkor ki kell bontani a tömböt, megcsinálni a változást és megadni újra a 
    useState-snek) random kiválasztottaknak, majd a objektumából a selected és a highlighted true lesz
    Fontos, hogy csinálunk egy checkDuplications tömböt és a while-val a dimensions gyökig töltünk bele ide random számokat 
    de csak, akkor töltjük bele ha még eddig nem volt benne -> includes és csak akkor push-oljuk bele 
    */
    const startGame = () => {
        setDisableCells(true);
        const checkDuplications = [];
        const cs = [...cells];

        while (disableCells.length < Math.sqrt(dimensions)) {
            const randIndex = rNumber(0, dimensions - 1);
            //mert ez a randIndex majd a cs-nek az indexei lesznek és ezért kell, hogy 0-tól dimensions-1-ig menjen!!! 

            if (!checkDuplications.includes(randIndex)) {
                checkDuplications.push(randIndex);
                cs[randIndex].highlighted = true;
                cs[randIndex].selected = true;
            }
            /*
            ha a randIndex nem volt benne a checkDuplications-ben, akkor push-val belerakjuk azt a számot illetve 
            azzal a számmal(index-vel) a cs (kibontott cells)-nek a highlighted és selected kulcsait true-ra állítjuk 
            és majd ezzel a cs-vel, amikor már megtörténtek a változtatások, akkor frissítjük a useState-s cells-t 
            */
        }

        setCells([...cs]);//így adjuk meg, hogy biztosan ráagáljon a react a változásokra! 

        setTimeout(() => {
            /*
            mindegyik highlighted a cells-ben azt akarjuk, hogy false legyen ha végbement az animation, ezért csinálunk egy for-t 
            dimensions-ig és minden highlighted-ot false-ra állítunk majd ezzel megint a cells-t frissítjük
            */
            for (let i = 0; i < dimensions; i++) {
                cs[i].highlighted = false;//mindegyik, tehát a i-edik a cs-ben false lesz 
            }
            setCells(cs);//useState-s frissítése
            setDisableCells(false);
        }, 3000); //3000ms, mert annyi a animation-duration 
    };

    /*
    cellClick, amikor a játékos rákattint egy cell-re, tehát vár egy index-et, hogy melyikre kattintott rá és amikor a cells-en végigmegyünk 
    egy map-val, akkor az összes kap majd egy index-et, amit key-nek is majd meg kell adni és ezt az i-t várja majd ez a függvény
    fontos
    1. csak akkor lehet a cell-re kattintani, hogyha nem disableCells, tehát az false, ha nem true, akkor még megy az animation, tehát return
    2. akkor tudjuk, hogy jóra kattintottunk, hogyha a selected az true, ilyen esetben növeljük a pontokat a hitCounter-t és adunk egy 
    selected-well class-t a userSelected-nek, hogy zöld-vel világítson majd a mező 
    ha nem jó, akkor újra le kell majd generálni a táblát, tehát a generateCells-et meghívjuk és a hitCounter-t is nullázuk és kap egy selected-wrong
    class-t is ami miatt majd zölden fog világítani 
    */
    const cellClick = (i) => {
        if (disableCells) {
            alert("Please wait until the cell disappears!");
            return;
        }

        const cs = [...cells];

        if (cells[i].selected) {
            cs[i].userSelected = "selected-well";
            setPoints(p => ++p);
            setHitCounter(hc => ++hc);
        } else {
            cs[i].userSelected = "selected-wrong";
            setDisableCells(true);//ne tudjunk ilyenkor kattintani 
        }

        /*
        azért kell, hogy lássuk mikor piros és utána generálja le az új táblát, mert rögtön legenerálná és nem látnánk, amikor piros lesz 
        tehát a selected-wrong class-t megkapja 
        */
        setTimeout(() => {
            generateCells();
            setDisableShow(false);//mutassa az új játék gombot 
        }, 1000);
    }

    /*
    Ezt mindig meg kell majd hívni amikor betölt a komponens 
    */
    useEffect(() => {
        generateCells();
    }, []);

    /*
    Hitcounter-re kell majd reagálni, mert ha eléri a dimensions-nak a gyökét, akkor kell majd a dimensions növelni a dimensions - 1 négyzetével
    és ha majd ez a dimension növekszik, most 4 abból -1 az 3, annak a négyzete 9 és ha ez 9 akkor fogjuk az új játékot legenerálni!!! 
    */
    useEffect(() => {
        if (hitCounter === Math.sqrt(dimensions)) {
            setDisableCells(true);

            setTimeout(() => {
                setDimensions((Math.sqrt(dimensions) + 1) ** 2);
                setHitCounter(0);
                setDisableShow(false);
            }, 1000);
        }
    }, [hitCounter]);

    //ha megváltozott a dimensions, akkor legenerálunk egy új táblát, de csak akkor ha a cell-ek léteznek és a length-jük nem nulla 
    useEffect(() => {
        if (cells.length !== 0)
            return;

        generateCells();
    }, [dimensions]);

    return (<div className="container-md p-lg text-center box-secondary-lighter">
        <h1>Cell Memory Game</h1>
        <h2>Points: {points}</h2>

        <div className={(`grid-col-${Math.sqrt(dimensions)} grid-row-${Math.sqrt(dimensions)}`) + "maxw-500 height-500 margin-auto-x"}>
            {
                cells.map((c, i) =>
                    <div key={i} style={c.highlighted ? { animationName: "highlighted-cell", animationDuration: "3s" } : {}}
                        onClick={() => cellClick(i)} className={"box-light-grey table-border cursor-pointer" + (c.userSelected)}>

                    </div>
                )
            }
        </div>

        {
            !disableShow &&
            <button onClick={startGame} className="input-md btn-primary center-input">
                Show!
            </button>
        }
    </div>
    );
}

export default MemoryGame;