(() => {
    //Calculates my age
    function ageCalc(){
        var dateVar = new Date();
        var text;

        if(dateVar.getMonth() < 11)
            text = (dateVar.getFullYear() - 2005) - 1;
        else
            text = dateVar.getFullYear() - 2005;

        document.getElementById('age').textContent = "I'm " + text + " years old.";
    }

    return () => {
        ageCalc() // Calculates my age
    }
})()()