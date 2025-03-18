import { HttpErrorResponse } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { EMPTY, Observable, OperatorFunction, catchError } from "rxjs";

/**
 * Default error handler
 *
 * @param toastService toast service instance
 */
export const defaultCatchError = <T>(toastService: MessageService): OperatorFunction<T, T> =>
    catchError((error: HttpErrorResponse, _: Observable<T>) => {
        console.error(error); // Log error
        toastService.add({
            severity: 'error',
            summary: 'Error',
            detail:  getMessage(error),
          });

        return EMPTY;
    });

function getMessage(error: HttpErrorResponse): string {
    if (typeof error.error === "string") {
        return error.error;
    }

    if (typeof error.error?.message === "string") {
        return error.error.message;
    }

    return "Something bad happend";
}