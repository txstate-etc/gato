[#assign redirectUrl = gf.absoluteUrl(content.link)]
[#if cmsfn.isPublicInstance()]
  [#if content.link?has_content]
    ${ctx.response.sendRedirect(redirectUrl)}
  [/#if]
[#else]
<!DOCTYPE HTML>
<html>
<head>
  <title>Redirect</title>
  [@cms.init /]
  <style type="text/css">
    .notice {
      font-size: 200%;
      text-align: center;
      border: 3px solid black;
      margin: 10% auto;
      padding: 10px;
      width: 70%;
    }
  </style>
</head>
<body style="background-color: white">
  <div class="notice">
    This is a redirect page.
    [#if content.link?has_content]
      If you were viewing it as a user, rather
      than an admin, you would immediately be sent to:
      <br><br>
      <a href="${redirectUrl}" style="color: blue">${redirectUrl}</a>
    [#else]
      <br><br>
      Since you have not set a target URL, a regular user would see a blank screen.
    [/#if]
    <br><br>
    You can set or change the target URL with the "Edit page properties" button in the panel to the right.
  </div>
</body>
</html>
[/#if]
