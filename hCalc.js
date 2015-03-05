/* 

 */
function HCalc(form){
    
    //link to hCalc form element
    this.form = form;
    
    //link to outputField page element
    this.outputField = form.outputField;
    
    //link to operationSignField page element
    this.operationSignField = form.currentOperationSign;
    
    //link to memoryField page element
    this.memoryField = form.memoryField;
    
    //Triggers if new number is expected
    this.flagNewNum = false;
    
    //Stores last operation user chose
    this.pendingOperation = '';
    
    // Subtotal Value
    this.cache = 0;
    
    // Value stored in memory via M+/M-
    this.memory = 0;
    
    // Active Calc mode
    this.activeMode = 'dec';
}
// Updates output when any digit is pressed
HCalc.prototype.numPressed = function(num){
    if(this.isDec()){
        if (this.flagNewNum) {
            this.outputField.value = num;
            this.flagNewNum = false;
            }	   
        else {
            //Prevents digits after 0
            if (this.outputField.value  ==  '0')
                this.outputField.value = num;
            else
                this.outputField.value += num;
            }
    }
}

// Manages main operations +,-,*,/,=
HCalc.prototype.operationSimple = function(operation){
     if(this.isDec()){
        if (this.flagNewNum && this.pendingOperation != '=')
        {
                this.outputField.value = this.cache;
        }
        else{
            this.flagNewNum = true;
            if ( '+' == this.pendingOperation )
                    this.cache += parseFloat(this.outputField.value);
            else if ( '-' == this.pendingOperation )
                    this.cache -= parseFloat(this.outputField.value);
            else if ( '/' == this.pendingOperation )
                    this.cache /= parseFloat(this.outputField.value);
            else if ( '*' == this.pendingOperation )
                    this.cache *= parseFloat(this.outputField.value);
            else
                    this.cache = parseFloat(this.outputField.value);
            this.outputField.value = this.cache;
            this.updateOperationSign(operation);
        }
    }
};
HCalc.prototype.updateOperationSign = function(operation){
    // Checks if there is new sign or just we need to update
    if(operation !== null)
        this.pendingOperation = operation;
    // After Calculation pendingOperation sign goes blank
    if(operation == '=')
        this.pendingOperation = '';
    this.operationSignField.value = this.pendingOperation;
};

//Adds decimal to number
HCalc.prototype.decimal = function(){
    if(this.isDec()){
        if (this.flagNewNum){
            this.outputField.value = '0.';
            this.flagNewNum = false;
        }
        else{
            // If there is no point in current number - add one.
                if (this.outputField.value.indexOf('.') == -1)
                        this.outputField.value += '.';
        }
    }
};

// Clear current digits from screen. Leave cache and pandingOperation as is.
HCalc.prototype.clearEntry = function(){
    if(this.isDec())
        this.outputField.value = '0';
};
HCalc.prototype.clear = function(){
    this.outputField.value = '0';
    this.flagNewNum = false;
    this.cache = 0;
    this.updateOperationSign('');
    this.mode('dec');
};
//Deletes last digit from screen
HCalc.prototype.delete = function (){
    if(this.isDec()){
        if(this.outputField.value !== '0'){
            this.outputField.value = this.outputField.value.substr(0,(this.outputField.value.length-1));
            if(this.outputField.value == '')
                this.outputField.value = '0';
        }
    }
}

HCalc.prototype.exponentTwo = function(){
    this.outputField.value *= this.outputField.value;
    this.updateOperationSign('');
};

HCalc.prototype.plusMinus = function(){
    if( this.activeMode == 'dec'){
        if(this.outputField.value.indexOf('-') == 0)
            this.outputField.value = this.outputField.value.substr(1,this.outputField.value.length);
        else
            this.outputField.value = '-'.concat(this.outputField.value);
    }
};
// Convert result to HEX/BIN/ROMAN modes. No calculation will be aviable in those modes.
HCalc.prototype.mode = function(mode){
    if(mode !== null && mode !== this.activeMode ){
        if(this.isDec()){
            this.cache = this.outputField.value;
            this.form.className = "hCalc disabled";
        }
        else{
            this.outputField.value = this.cache;
        }
        switch (mode) {
            case 'hex': 
                this.outputField.value =  (Number)(this.outputField.value).toString(16);
                this.activeMode = mode;
                break;
            case 'bin': 
                this.outputField.value =  (Number)(this.outputField.value).toString(2);
                this.activeMode = mode;
                break;
            case 'dec': 
                this.cache = 0;
                this.activeMode = mode;
                document.getElementById('decButton').checked = true;
                this.form.className = "hCalc";
                break;
            case 'rom': 
                this.outputField.value = this.toRoman(this.outputField.value);
                this.activeMode = mode;
                break;
                
        }
        this.activeMode = mode;
    }
};
HCalc.prototype.toRoman = function(number){
    if(!number) return '';
    var arabian = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000, 5000, 10000, 50000, 100000];
    var roman = ['I','IV','V','IX','X','XL','L','XC','C','CD','D','CM','M','\u2181','\u2182','\u2187','\u2188'];

    var temp = '';
    var i = arabian.length - 1;
    while(number > 0){
        if(number >= arabian[i]){
            temp += roman[i];
            number -= arabian[i];
        }
        else
            i--;
    }
    return temp;
};

// Return true if activeMode is Decimal
HCalc.prototype.isDec = function(){
    if (this.activeMode == 'dec')
        return true;
    else 
        return false;
};

//Updates memory status on screen
HCalc.prototype.updateMemory = function(){
    this.memoryField.value = this.memory;
};
// Adds current result to memory
HCalc.prototype.memoryPlus = function(){
    if(this.isDec()){
        this.memory += parseFloat(this.outputField.value);
        this.updateMemory();
        this.flagNewNum = false;
    }
};

// Substract current result from memory
HCalc.prototype.memoryMinus = function(){
    if(this.isDec()){
        this.memory -= parseFloat(this.outputField.value);
        this.updateMemory();
        this.flagNewNum = false;
    }
};

// Clear memory
HCalc.prototype.memoryClear = function(){
    if(this.isDec()){
        this.memory = 0;
        this.updateMemory();
    }
};

// Paste memory to output
HCalc.prototype.memoryPaste = function(){
    if(this.isDec()){
        this.outputField.value = this.memory;
    }
};





