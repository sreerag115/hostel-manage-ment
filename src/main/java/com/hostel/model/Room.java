package com.hostel.model;

public class Room {
    private String roomId;
    private String roomType;
    private int capacity;
    private int occupied;
    private String floor;
    private String status;

    public Room() {}

    public Room(String roomId, String roomType, int capacity, int occupied, String floor, String status) {
        this.roomId = roomId;
        this.roomType = roomType;
        this.capacity = capacity;
        this.occupied = occupied;
        this.floor = floor;
        this.status = status;
    }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getOccupied() { return occupied; }
    public void setOccupied(int occupied) { this.occupied = occupied; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getVacancy() {
        return Math.max(0, capacity - occupied);
    }
}
