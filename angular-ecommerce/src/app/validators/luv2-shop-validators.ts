import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    //Whitespace Validation
    static notOnlyWhitespace(control: FormControl):ValidationErrors{
        // Check If String Only Contains Whitespace
        if((control.value != null) && (control.value.trim().length === 0)){
            // Invalid, Return Error Object
            return {'notOnlyWhitespace':true};
        }else {
            // Valid
            return null;
        }
    }
}
