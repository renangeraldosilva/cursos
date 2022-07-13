import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './cursos/componentes/formulario/formulario.component';
import { ListaComponent } from './cursos/componentes/lista/lista.component';

const routes: Routes = [
  {path: '', component: ListaComponent},
  {path: 'home', component: HomeComponent},
  {path: 'criar', component: FormularioComponent },
  {path: 'editar/:id', component: FormularioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
