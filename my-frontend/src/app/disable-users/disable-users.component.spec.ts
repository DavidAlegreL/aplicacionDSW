import { ComponentFixture, TestBed } from '@angular/core/testing';
 
 import { DisableUsersComponent } from './disable-users.component';
 
 describe('DisableUsersComponent', () => {
   let component: DisableUsersComponent;
   let fixture: ComponentFixture<DisableUsersComponent>;
 
   beforeEach(async () => {
     await TestBed.configureTestingModule({
       imports: [DisableUsersComponent]
     })
     .compileComponents();
 
     fixture = TestBed.createComponent(DisableUsersComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });
 
   it('should create', () => {
     expect(component).toBeTruthy();
   });
 });