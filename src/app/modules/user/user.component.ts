import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/http/user.service';
import { Observable, map, switchMap } from 'rxjs';
import { User } from '../../core/model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{

  listUsers$: Observable<any>
  totalUser$: Observable<number>

  userId$: Observable<any>
  visibleAdd:boolean = false
  visibleView:boolean = false
  visibleUpdate:boolean = false
  message:boolean=false

  usersForm: FormGroup
  editUsersForm: FormGroup
  editUserId
  page: number = 1
  limit: number = 3
  searchData : string=""
  searchControl = new FormControl();

  // this.router.snapshot.params.id
  selects = [
    {name:"Tous", value:'all'},
    {name:"Connecter", value:'is_checked'},
    {name:"Deconnecter", value:'not_checked'}
  ]
// searchList
  constructor(private userService:UserService, private fb: FormBuilder, private router: ActivatedRoute){
    this.usersForm = this.fb.group({
      first_name_nomad: [''],
      last_name_nomad: ['']
    });
    // 
    this.editUsersForm = this.fb.group({
      first_name_nomad: ['', Validators.required],
      last_name_nomad: ['', Validators.required]
    });
  }

 
    

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      switchMap(
        (el:any)=>{
          this.searchData = el
          console.log("this.searchData =>", this.searchData); 
          return this.userService.findUserServerJson(this.searchData, this.page, this.limit)
        
        }
      )
    ).subscribe()
    this.getUser()
  }

  getUser(){
    
    this.userService.findUserServerJson(this.searchData, this.page, this.limit).subscribe()
    this.listUsers$= this.userService.infoUserObservable$
    this.totalUser$ = this.userService.totalObservable$
  }

  lazyLoad(event){
    console.log("event", event);  
    this.page = (event.first / event.rows) + 1
    console.log("this.page", this.page);  
    this.userService.findUserServerJson(this.searchData, this.page, this.limit).subscribe()
  }

  getUserById(id:string){  
    this.visibleView = true 
    this.userService.findUserByIdServerJson(id)
    this.userId$ = this.userService.infoUserId.asObservable()
    console.log("this.userId$ =>", this.userId$);

  }

  addUser(){
    this.visibleAdd =true
  }

  CreateUser(){
    console.log("enregistrement", this.usersForm.value);
    this.userService.addUserServerJson(this.usersForm.value)
    this.visibleAdd =false
    this.message=true
    this.usersForm.reset()
    this.getUser()
  }

  removeMessage(){
    this.message=false
  }

  editUser(id){
    this.visibleUpdate =true
    this.editUserId =id
    this.userService.findUserByIdServerJson(id);
    this.userId$ = this.userService.infoUserId.asObservable();

    this.userId$.subscribe((user) => {
      if (user) {
        this.editUsersForm.patchValue({
          first_name_nomad: user.first_name_nomad,
          last_name_nomad: user.last_name_nomad
        });
      }
    });

  }

  updateUser(){
    if (this.editUsersForm.valid) {
      this.userService.updateUserByIdServerJson(this.editUserId, this.editUsersForm.value);
      this.visibleUpdate = false;
      this.getUser();
    }
  }

  deleteUser(id){
    this.userService.deleteUserByIdServerJson(id)
    this.getUser()
  }











  pageChange(event){
    console.log("event", event);
    this.page = (event.first / event.rows) + 1
    console.log("pageNumber", this.page);
    // this.homologationDetailOmciService.findAllHomologationDetail(this.startDate, this.endDate, this.msisdn, this.pageNumber, this.compliant).subscribe()
    
  }

  search(){
    const formData = this.usersForm.value;
    console.log("formData=>", formData);
  }


}
