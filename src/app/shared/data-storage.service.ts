import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const recipes = this.recipeService.getRecipes();
        return this.http.put(
          'https://recipes-app-113ab-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
          recipes,
          {
            params: { auth: user.token },
          }
        );
      })
    ).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get<Recipe[]>(
          'https://recipes-app-113ab-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', // 'https://recipes-app-113ab-default-rtdb.europe-west1.firebasedatabase.app/recipes.json?auth=' + user.token
          {
            params: new HttpParams().set('auth', user.token)
          }
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
