import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { RootUser, User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  infoUserSubject = new BehaviorSubject<User[]>([])
  infoUserObservable$ = this.infoUserSubject.asObservable()

  totalSubject = new BehaviorSubject<number>(0)
  totalObservable$ = this.totalSubject.asObservable()


  infoUserId= new BehaviorSubject<User | undefined>(undefined)

  apiServerJson="/api/user"
  findUserServerJson(lastName, page, limit):Observable<RootUser>{
    return this.http.get(`${this.apiServerJson}?last_name=${lastName}&_page=${page}&_per_page=${limit}`).pipe(
      map(
        (el:any)=>{
          console.log("el service=>", el);
          console.log("el.data service=>", el.data);
          let total= el.items
          return {                //si tu ne met pas de return, les données ne s'afficheront pas
            infoData: el.data,
            total: total
          } 
        }
      ),
      tap(
        (resp:any)=>{
          console.log("el tap =>", resp);
          this.infoUserSubject.next(resp.infoData)
          this.totalSubject.next(resp.total)
        }
      )
    )
  } 

  findUserByIdServerJson(id){
    return this.http.get(`${this.apiServerJson}/${id}`)
    .pipe(
      map(
        (el_id)=>{
          console.log("el_id service=>", el_id);  
          return el_id
        }
      )
    ).subscribe(
      (rep_id)=>{
        this.infoUserId.next(rep_id)
      }
    )
  }

  addUserServerJson(data){
    console.log("enregistrement", data);
    this.http.post(this.apiServerJson, data)
    .pipe(
      map(
        (resp)=>{
          console.log("enregistrement pipi", resp);
          return resp
        }
      )
    ).subscribe()
  }

 
  updateUserByIdServerJson(id, data){
    console.log("modification", data);
    this.http.patch(`${this.apiServerJson}/${id}`, data)
    .pipe(
      map(
        (resp)=>{
          console.log("modification pipi", resp);
          return resp
        }
      )
    ).subscribe(
      (next_resp)=>{
        this.infoUserId.next(next_resp)
      }
    )
  }

  deleteUserByIdServerJson(id){
    this.http.delete(`${this.apiServerJson}/${id}`)
    .pipe(
      map(
        (resp)=>{
          console.log("delete resp =>", resp);
          return resp
        }
      )
    ).subscribe(
      (next_resp)=>{
        this.infoUserId.next(next_resp)
      }
    )
  }

}
