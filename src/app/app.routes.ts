import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreateRoomComponent } from './pages/room/create-room/create-room.component';
import { RoomListComponent } from './pages/room/room-list/room-list.component';
import { EditRoomComponent } from './pages/room/edit-room/edit-room.component';
import { BedListComponent } from './pages/bed/bed-list/bed-list.component';
import { CreateBedComponent } from './pages/bed/create-bed/create-bed.component';
import { EditBedComponent } from './pages/bed/edit-bed/edit-bed.component';
import { CreateBookingComponent } from './pages/booking/create-booking/create-booking.component';
import { authGuard, employeeGuard } from './guards/auth.guard';
import {AdminDashboardComponent} from './pages/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rooms', component: RoomListComponent, canActivate: [authGuard] },
  { path: 'room/:id', component: RoomListComponent, canActivate: [authGuard] }, // New route
  { path: 'beds', component: BedListComponent, canActivate: [authGuard] },
  { path: 'create-room', component: CreateRoomComponent, canActivate: [employeeGuard] },
  { path: 'edit-room/:id', component: EditRoomComponent, canActivate: [employeeGuard] },
  { path: 'create-bed', component: CreateBedComponent, canActivate: [employeeGuard] },
  { path: 'edit-bed/:id', component: EditBedComponent, canActivate: [employeeGuard] },
  { path: 'create-booking', component: CreateBookingComponent},
  {path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, employeeGuard]},

  { path: '**', redirectTo: '' }
];
