function enviar() {
    
    alert('andre');
    $.ajax( {
      url: 'http://localhost:9081/api/v1/documento',
      type: 'POST',
      data: new FormData( $( '#formData' ) ),
      processData: false,
      contentType: false
    } );
    //e.preventDefault();

}