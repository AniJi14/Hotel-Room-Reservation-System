import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

interface Room {
  number: number;
  floor: number;
  occupied: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  floors: Room[][] = [];
  bookedRooms: Room[] = [];
  roomCount: number = 1;
  errorMessage: string = ''; // For displaying error messages

  constructor() {
    this.initializeRooms();
  }

  initializeRooms() {
    this.floors = [];
    for (let floor = 1; floor <= 10; floor++) {
      let rooms = [];
      let totalRooms = floor === 10 ? 7 : 10;
      for (let i = 1; i <= totalRooms; i++) {
        rooms.push({ number: floor * 100 + i, floor, occupied: false });
      }
      this.floors.push(rooms);
    }
    this.bookedRooms = [];
    this.errorMessage = '';
  }

  bookRooms(count: number) {
    this.errorMessage = '';

    if (count < 1 || count > 5) {
      this.errorMessage = 'You have to select between 1 and 5 rooms to book.';
      return;
    }

    let availableRooms: Room[] = [];
    for (let floor of this.floors) {
      let unoccupiedRooms = floor.filter(r => !r.occupied);
      availableRooms.push(...unoccupiedRooms);
    }

    if (availableRooms.length === 0) {
      this.errorMessage = 'No available rooms for booking.';
      return;
    }

    if (availableRooms.length < count) {
      this.errorMessage = `Only ${availableRooms.length} rooms are available. Please select fewer rooms.`;
      return;
    }

    this.bookedRooms = availableRooms.slice(0, count);
    this.bookedRooms.forEach(room => room.occupied = true);
  }

  generateRandomOccupancy(count: number) {
    let availableRooms: Room[] = [];
    this.floors.forEach(floor => {
      floor.forEach(room => {
        if (!room.occupied) {
          availableRooms.push(room);
        }
      });
    });

    if (availableRooms.length < count) {
      count = availableRooms.length;
    }

    for (let i = 0; i < count; i++) {
      let randomIndex = Math.floor(Math.random() * availableRooms.length);
      availableRooms[randomIndex].occupied = true;
      availableRooms.splice(randomIndex, 1);
    }
  }

  resetBooking() {
    this.initializeRooms();
  }
}