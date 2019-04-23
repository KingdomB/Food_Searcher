//METHOD 1:
/*Function uses regular expression, which is a sequence of characters that define a search pattern. This pattern is used by string searching algorithms for "find" or "find and replace" operations on strings, or for input validation.
g = global; which is a flag that indicates the regular expression should be tested against all possible matches in a string & i = non-case sensitive
[] contains the regular expression logic that groups 'a' through 'z' and excludes all other characters using ^ = everything except*/
function lettersOnly(event) {
  var input = this;
  var regex = /[^a-z\s]/gi;
  input.value = input.value.replace(regex, "")
}

//Event listener for alpha text input 
$('#mealText').on('keyup', lettersOnly)


//METHOD 2:
/*Function uses regular expression, which is a sequence of characters that define a search pattern. This pattern is used by string searching algorithms for "find" or "find and replace" operations on strings, or for input validation.
g = global; which is a flag that indicates the regular expression should be tested against all possible matches in a string 
[] contains the regular expression logic that groups 'a' through 'z' and excludes all other characters using ^ = everything except*/
function numbersOnly(input) {
  var regex = /[^0-9]/g; //OR could use /\D/
  input.value = input.value.replace(regex, "")
};
