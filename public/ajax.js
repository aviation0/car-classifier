$("ul ").on("click",".list-item-report", function(e){
    var id = jQuery(this).children("a").children("small").html();
    console.log(id);
    $.get(`/${id}`, (data) => {

        openPage('Home', this, 'rgb(42, 188, 214)');
        $("#picker-button").text("Pick XML");
        $('#vehicle-table tr').remove();
        $('.summary').remove();
        $('#xmpp xmp').remove();
        $('#vehicle-table').append(
        `
        <tr>
            <th>Vehicle ID</th>
            <th>Type</th>
            <th>Powertrain</th>
            <th>Wheel Count</th>
            <th>Frame</th>
        </tr>
        `
        );
        data.vehicles.forEach(function(vehicle){
            $('#vehicle-table').append(
            `
            <tr>
                <td>${vehicle.vehicleId}</td>
                <td>${vehicle.type}</td>
                <td>${vehicle.powertrain}</td>
                <td>${vehicle.wheelCount}</td>
                <td>${vehicle.frame}</td>
                
            </tr>
            `
            );
        });
        $('#xml-button').css("display", "block");
        $('#table-container-div').append(
        `
            <ul class="summary">
                <li>${data.types.BigWheel} vehicles of type <strong>Big Wheel</strong></li>
                <li>${data.types.Bicycle} vehicles of type <strong>Bicycle</strong></li>
                <li>${data.types.Motorcycle} vehicles of type <strong>Motorcycle</strong></li>
                <li>${data.types.HangGlider} vehicles of type <strong>HangGlider</strong></li>
                <li>${data.types.Car} vehicles of type <strong>Car</strong></li>
            </ul>
        
        `    
        );
        $('#xmpp').append(
        `
            <xmp>${data.xmlFile}</xmp>
        
        `    
        );
        
    });
    
});

$('input[type=file]').change(function(e){
    $in=$(this);
    if($in.val()){
        $("#picker-button").text($in.val().substring(12)); //removing C:fakefile/
    } else {
        $("#picker-button").text("Pick XML");
    }
});

$("#new-file-form").submit( function(e){
    e.preventDefault();

    var formData = new FormData(this);
    // console.log(formData);
    
    $.ajax({
        type: "POST",
        url: '/new',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log(data);
            $('#vehicle-table tr').remove();
            $('.summary').remove();
            $('#xmpp xmp').remove();
            $('#vehicle-table').append(
            `
            <tr>
                <th>Vehicle ID</th>
                <th>Type</th>
                <th>Powertrain</th>
                <th>Wheel Count</th>
                <th>Frame</th>
            </tr>
            `
            );
            var obj = JSON.parse(data);
            obj.vehicles.forEach(function(vehicle){
                $('#vehicle-table').append(
                `
                <tr>
                    <td>${vehicle.vehicleId}</td>
                    <td>${vehicle.type}</td>
                    <td>${vehicle.powertrain}</td>
                    <td>${vehicle.wheelCount}</td>
                    <td>${vehicle.frame}</td>
                    
                </tr>
                `
                );
            });
            $('#xml-button').css("display", "block");
            $('#table-container-div').append(
            `
                <ul class="summary">
                    <li>${obj.types.BigWheel} vehicles of type <strong>Big Wheel</strong></li>
                    <li>${obj.types.Bicycle} vehicles of type <strong>Bicycle</strong></li>
                    <li>${obj.types.Motorcycle} vehicles of type <strong>Motorcycle</strong></li>
                    <li>${obj.types.HangGlider} vehicles of type <strong>HangGlider</strong></li>
                    <li>${obj.types.Car} vehicles of type <strong>Car</strong></li>
                </ul>
            
            `    
            );

            $('#xmpp').append(
                `
                    <xmp>${obj.xmlFile}</xmp>
                
                `    
                );

            $("#report-list").prepend(
            `
            <li class="list-item-report">
            <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <small class="text-muted">${new Date(obj.timestamp)}</small>
                    <h4 class="mb-1">${obj.originalname}</h4>
                </div>
                <p class="mb-1">${obj.types.BigWheel +obj.types.Motorcycle +obj.types.Bicycle +obj.types.HangGlider +obj.types.Car} Vehicles</p>
                <small class="text-muted">${obj._id}</small>
            </a>
            </li>

            <br>
            `    
            )
        }
    });
});




var modal = $('#xml-modal');
// When the user clicks the button, open the modal 
$("#xml-button").on("click", function() {
    modal.css("display", "block");
});

// When the user clicks on <span> (x), close the modal
$("#close").on("click", function() {
  modal.css("display", "none");
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.css("display", "none");
  }
}




function openPage(pageName,elmnt,color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
