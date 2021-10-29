import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../services/main.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '(document:click)': 'onBodyClick($event)',
  },
})
export class HomeComponent implements OnInit {

  phoneNumber : string = '';
  filterValue : string = '';
  countries: Array<any>;
  filteredCountries: Array<any>;
  selectedCountry = {
    name: 'Select Country',
    flags: { 
      png: ''
    },
    alpha2Code: '',
    callingCodes: ''
  };

  phoneValidation = {}

  validator:boolean = false;
  phoneValidated:boolean = false;
  inputNumberFocused: boolean = false;

  showCountriesDropdown = false;

  @ViewChild('countriesDropdownMenu') countriesDropdownMenu: ElementRef;
  @ViewChild('countriesDropdownButton') countriesDropdownButton: ElementRef;
  @ViewChild('filterInput') filterInput: ElementRef;
  
  constructor(
    private _mainService: MainService,
    private _eref: ElementRef
  ) {
  }
  
  ngOnInit(): void {
    this.getCountries();
  }

  onBodyClick(event) {
    if(!this.countriesDropdownButton.nativeElement.contains(event.target)  
      && event.target !== this.countriesDropdownMenu.nativeElement
      && event.target !== this.filterInput.nativeElement
    ){
      this.hideCountries();
    }     
  }

  getCountries() {
    this._mainService.getCountries().subscribe(
      (res) => {
        this.countries = res;
        this.filteredCountries = res;
      },
      (err) => {
        console.log(err)
      }
    )
  }

  selectCountry(index){
    this.selectedCountry = this.filteredCountries[index];
  }

  filterCountries(e){
    var filtered = this.countries.filter((country) => {
      if(country.name.toUpperCase().includes(this.filterValue.toUpperCase())){
        return country;
      }
    })

    this.filteredCountries = filtered;
  }

  focusInputNumber(value){
    this.inputNumberFocused = value;
  }

  verify(){
    this.validator = true;
    if(this.validateNumber() && this.selectedCountry.name !== 'Select Country'){
      this.validator = false;
      this._mainService.verifyNumber(this.phoneNumber, this.selectedCountry.alpha2Code).subscribe(
        (res) => {
          this.phoneValidated = true;
          this.phoneValidation = res;
        },
        (err) => {
          console.log(err)
        }
      );
    }else{
      this.phoneValidated = false;
      this.phoneValidation = {};
    }
  }

  keyupNumber(e){
    var keycode = e.keyCode;
    if(keycode == '13'){
      this.verify(); 
    }
  }

  validateNumber(){
    var regex = /^[0-9]*$/;
    if(this.phoneNumber === ''){
      return false
    }
    if(regex.test(this.phoneNumber))
      return true;
    else 
      return false;
  }

  showCountries(){
    this.showCountriesDropdown = true;
  }

  hideCountries(){
    this.showCountriesDropdown = false;
  }

  reset(){
    this.validator = false;
    this.selectedCountry = {
      name: 'Select Country',
      flags: { 
        png: ''
      },
      alpha2Code: '',
      callingCodes: ''
    };
    this.filteredCountries = this.countries;
    this.phoneNumber = '';
    this.phoneValidated = false;
    this.phoneValidation = {};
    this.filterValue = '';
  }
}
