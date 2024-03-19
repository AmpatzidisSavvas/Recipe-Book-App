import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  
  @ViewChild('triggerToast') triggerToast: ElementRef;
  recipe: Recipe;
  id: number;

  constructor( private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    )
    
  }

  onAddToShoppingList() {

    const config: Partial<IndividualConfig> = {
      positionClass: 'toast-center',
      enableHtml: false,
      tapToDismiss: true,
      timeOut: 3000,
      toastClass: 'toast'
    };
    
    this.toastr.show('Ingrendients added to shopping list!', '', config);
    this.recipeService.onAddIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo:this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
