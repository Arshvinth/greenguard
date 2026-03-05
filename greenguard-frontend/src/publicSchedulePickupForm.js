import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, TextField, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import theme from './theme';

export function PickupForm() {
    const [pickUpID, setPickUp_ID] = useState("");
    const [Username, setName] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [wasteType, setWasteType] = useState("");
    const [capacity, setCapacity] = useState("");
    const [phone, setPhone] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Sri Lanka");
    const [pickUpStatus, setStatus] = useState("Pending");

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8081/requestPickup/latestPickupID")
            .then(response => {
                setPickUp_ID(response.data.newPickUpID);
            })
            .catch(error => {
                console.error("Error fetching latest Pickup ID:", error);
            });
    }, []);

    const validateField = (field, value) => {
        let newErrors = { ...errors };

        switch (field) {
            case "name":
                newErrors.name = /^[A-Za-z ]+$/.test(value) ? "" : "Name must contain only letters and spaces.";
                break;
            case "phone":
                newErrors.phone = /^\d{10}$/.test(value) ? "" : "Phone number must be exactly 10 digits.";
                break;
            case "capacity":
                newErrors.capacity = /^\d+$/.test(value) ? "" : "Capacity must be a numeric value (kg).";
                break;
            case "pickupDate":
                const today = new Date();
                const selectedDate = new Date(value);
                newErrors.pickupDate = value && selectedDate > today ? "" : "Pickup date must be in the future.";
                break;
            case "wasteType":
                newErrors.wasteType = value ? "" : "Please select a waste type.";
                break;
            case "streetAddress":
                newErrors.streetAddress = /^[A-Za-z0-9\s,.\-]{5,}$/.test(value) ? "" : "Address must be at least 5 characters and include only valid characters.";
                break;
            case "city":
                newErrors.city = /^[A-Za-z\s]+$/.test(value) ? "" : "City must contain only letters and spaces.";
                break;
            case "country":
                newErrors.country = value === "Sri Lanka" ? "" : "Country must be Sri Lanka.";
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const sendData = (e) => {
        e.preventDefault();

        // Validate all fields
        ["name", "phone", "capacity", "pickupDate", "wasteType", "streetAddress", "city", "country"].forEach(field => {
            const value = {
                name: Username,
                phone,
                capacity,
                pickupDate,
                wasteType,
                streetAddress,
                city,
                country
            }[field];
            validateField(field, value);
        });

        const isValid = Object.values(errors).every((error) => error === "");
        if (!isValid) {
            alert("Please fix the errors before submitting.");
            return;
        }

        const fullAddress = `${streetAddress}, ${city}, ${country}`;

        const newPickUpRequest = {
            PickUp_ID: pickUpID,
            UserID: 130,
            Name: Username,
            PickupDate: pickupDate,
            wasteType: wasteType,
            Capacity: capacity,
            PickupLocation: fullAddress,
            Phone: phone,
            Status: pickUpStatus
        };

        axios.post("http://localhost:8081/requestPickup/addPickUpRequest", newPickUpRequest)
            .then(() => {
                alert("Pickup request Created");
                navigate("/");
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <Container sx={{ bgcolor: theme.palette.darkgreen.main, pb: 4 }}>
            <Typography
                variant='h4'
                align='center'
                fontWeight={'bold'}
                sx={{ mt: 3, mb: 2, pt: 4, color: theme.palette.orange.main }}
            >
                Schedule Your Pickup
            </Typography>

            <form onSubmit={sendData}>
                <Grid container spacing={2} sx={{ width: "80%", margin: "auto", pb: 4 }}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            value={Username}
                            onChange={(e) => { setName(e.target.value); validateField("name", e.target.value); }}
                            label="Your Name Mr/Mrs"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            InputLabelProps={{
                                sx: {
                                    color: "orange",
                                    fontWeight: "bold"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); validateField("phone", e.target.value); }}
                            label="Phone Number"
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone}
                            placeholder="e.g., 0771234567"
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            InputLabelProps={{
                                sx: {
                                    color: "orange",
                                    fontWeight: "bold"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            value={capacity}
                            onChange={(e) => { setCapacity(e.target.value); validateField("capacity", e.target.value); }}
                            label="Capacity (Kg)"
                            fullWidth
                            error={!!errors.capacity}
                            helperText={errors.capacity}
                            placeholder="e.g., 25"
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            InputLabelProps={{
                                sx: {
                                    color: "orange",
                                    fontWeight: "bold"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            value={pickupDate}
                            onChange={(e) => { setPickupDate(e.target.value); validateField("pickupDate", e.target.value); }}
                            label="Pickup Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.pickupDate}
                            helperText={errors.pickupDate}
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            required
                            value={wasteType}
                            onChange={(e) => { setWasteType(e.target.value); validateField("wasteType", e.target.value); }}
                            label="Waste Type"
                            fullWidth
                            error={!!errors.wasteType}
                            helperText={errors.wasteType}
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            InputLabelProps={{
                                sx: {
                                    color: "orange",
                                    fontWeight: "bold"
                                }
                            }}
                        >
                            <MenuItem value="Personal Devices">Personal Devices</MenuItem>
                            <MenuItem value="Household Appliances">Household Appliances</MenuItem>
                            <MenuItem value="Computer Accessories">Computer Accessories</MenuItem>
                            <MenuItem value="Communication Equipment">Communication Equipment</MenuItem>
                            <MenuItem value="Batteries & Lighting">Batteries & Lighting</MenuItem>
                            <MenuItem value="Industrial & Office">Industrial & Office E-Waste</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Address Fields */}
                    <Grid item xs={12}>
                        <TextField
                            required
                            value={streetAddress}
                            onChange={(e) => { setStreetAddress(e.target.value); validateField("streetAddress", e.target.value); }}
                            label="Street Address"
                            placeholder="e.g., No. 45, Galle Road"
                            fullWidth
                            error={!!errors.streetAddress}
                            helperText={errors.streetAddress || "Include house number and street name"}
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            InputLabelProps={{
                                sx: {
                                    color: "orange",
                                    fontWeight: "bold"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            value={city}
                            onChange={(e) => { setCity(e.target.value); validateField("city", e.target.value); }}
                            label="City/Town"
                            placeholder="e.g., Colombo"
                            fullWidth
                            error={!!errors.city}
                            helperText={errors.city || "Enter your city or town name"}
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            InputLabelProps={{
                                sx: {
                                    color: "orange",
                                    fontWeight: "bold"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            value={country}
                            onChange={(e) => { setCountry(e.target.value); validateField("country", e.target.value); }}
                            label="Country"
                            placeholder="e.g., Sri Lanka"
                            fullWidth
                            error={!!errors.country}
                            helperText={errors.country || "Country must be Sri Lanka"}
                            InputProps={{ sx: { backgroundColor: theme.palette.white.main, borderRadius: 1 } }}
                            InputLabelProps={{
                                sx: {
                                    color: "orange",
                                    fontWeight: "bold"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" sx={{ bgcolor: theme.palette.orange.main, m: 'auto' }}>
                            Order Pickup
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}
