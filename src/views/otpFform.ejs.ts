<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification OTP</title>
  <link rel="stylesheet" href="/styles.css"> <!-- Tu peux inclure un fichier CSS si nécessaire -->
</head>
<body>
  <div class="otp-container">
    <h2>Vérification OTP</h2>
    <form action="/verify-otp" method="POST">
      <div class="form-group">
        <label for="otp">Entrez le code OTP que vous avez reçu :</label>
        <input type="text" id="otp" name="otp" required placeholder="Code OTP" maxlength="6">
      </div>
      <div class="form-group">
        <button type="submit">Vérifier le code</button>
      </div>
    </form>
    
    <% if (message) { %>
      <p class="error-message"><%= message %></p>
    <% } %>
  </div>
</body>
</html>