<script type="text/javascript">
function upload_file(file, presignedUrl, publicUrl){
  submit = document.querySelector(".js-submit")
  submit.disabled = true
  document.querySelector(".js-signed-upload-status").textContent = "Uploading...";
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", presignedUrl);
  xhr.setRequestHeader('Content-Type', file.type);
  xhr.onload = function() {
    submit.disabled = false
    if (xhr.status === 200) {
      document.querySelector(".js-signed-upload-value").value = publicUrl;
      document.querySelector(".js-signed-upload-status").textContent = "";
    }
  };
  xhr.onerror = function() {
    submit.disabled = false
    alert("Could not upload file.");
  };
  xhr.send(file);
}

function get_signed_request(file, url){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url + "?filename="+file.name+"&filetype="+file.type);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
              data = JSON.parse(xhr.responseText)
              upload_file(file, data.presigned_url, data.public_url);
            }
            else{
                alert("Could not get signed URL.");
            }
        }
    };
    xhr.send();
}

function init_upload(field) {
  var file = field.files[0];
  if(file == null){
    return;
  }
  get_signed_request(file, field.dataset.presignUrl);
}

document.addEventListener("DOMContentLoaded", function(event) {
  field = document.querySelector(".js-signed-upload")
  field.onchange = function() { init_upload(field) };
});
</script>

<div class="form-group <%= "required" if field.required? %> <%= "has-error" if field.error? %>">
  <label class="control-label"><%= field.title %></label>
  <input type="file" class="js-signed-upload" data-presign-url="<%= presign_form_upload_path %>" />
  <input type="hidden" class="js-signed-upload-value" name="application_form[<%= field.key %>]" value="<%= field.value %>" />
  <p class="help-block js-signed-upload-status">
    <% if field.value.present? %>
    <a href="<%= field.value %>">File attached</a>
    <% end %>
  </p>
</div>

