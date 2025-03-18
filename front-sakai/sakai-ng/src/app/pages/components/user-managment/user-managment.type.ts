import { FormControl } from "@angular/forms";
import { Role } from "../../../core/models/models";

export interface UserCreateForm {
    username: FormControl<string>;
    email:  FormControl<string>;
    password: FormControl<string>;
    role: FormControl<Role[]>;
}

