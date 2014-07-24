<div class="comment-form">
<label class="req">Nickname</label>
<input name="nickname" title="Nickname" type="text" uniqueid="492068409" validation="type:text" />


<label>Comment</label>
<textarea cols="60" name="body" rows="4" title="Comment" validation="type:text;required:true;baseProperty:true"></textarea>


<label>Enter this word:</label>

<div class="captchaContainer">
<div id="captcha-audio"></div>
<img alt="CAPTCHA image" border="1" id="captcha-image" src="http://fa.pub30.convio.net/system/servlet/captcha" title="CAPTCHA image" /><br /> <a class="captchaLink" href="#" onclick="changeCaptcha()">Change image</a> <a class="captchaLink" href="#" onclick="changeAudioCaptcha()"><img align="top" alt="Visually impaired? Click here to have an audio challenge played.  You will then need to enter the code that is spelled out." border="0" src="http://fa.pub30.convio.net/assets/form/inline/accessibility.gif" title="Visually impaired? Click here to have an audio challenge played.  You will then need to enter the code that is spelled out." /></a><br /><input model="captcha" name="captcha" title="Captcha" type="text" validation="type:text" /></div>

<button class="button red" type="submit" value="Submit">Submit</button>

</div>