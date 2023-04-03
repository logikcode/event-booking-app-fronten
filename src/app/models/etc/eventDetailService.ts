import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {EventDetailPojo} from "./EventDetailPojo";

@Injectable({
  providedIn: 'root'
})
export class EventDetailService {
  eventDetailPojoBehaviorSubject: BehaviorSubject<EventDetailPojo> = new BehaviorSubject<EventDetailPojo>(null);

}
