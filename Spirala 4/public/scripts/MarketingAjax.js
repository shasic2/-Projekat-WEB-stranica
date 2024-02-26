const MarketingAjax = (function()  {


  function sendFilteredProperties(propertyIds) {
    const url = '/marketing/nekretnina/:id';
    const requestData = {
      propertyIds: propertyIds
    };

    const ajax = new XMLHttpRequest();
    ajax.open('POST', url);
    ajax.setRequestHeader('Content-Type', 'application/json');

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          console.log('Filtrirane nekretnine uspešno poslate.');
        } else {
          console.error('Greška prilikom slanja filtriranih nekretnina.');
        }
      }
    };

    ajax.onerror = function () {
      console.error('Greška prilikom slanja zahtjeva');
      fnCallback({ error: 'Network error occurred.' }, null);
    };

    ajax.send(JSON.stringify(requestData));
  }




  function sendClickedNekretnina(id) {
    $.ajax({
        type: "POST",
        url: "/marketing/nekretnina/" + id,
        success: function (data) {
            console.log("Clicked nekretnina sent successfully.");
        },
        error: function (error) {
            console.error("Error sending clicked nekretnina:", error);
        }
    });
}



  // Return public methods
  return {
    sendFilteredProperties :sendFilteredProperties,
    sendClickedNekretnina: sendClickedNekretnina
  };
})();
