'use client'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

export default function AdminDashboardPage() {
  return (
    <>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ผู้ใช้งานทั้งหมด
              </Typography>
              <Typography variant="h3" fontWeight={500}>
                124
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                รายการที่รอดำเนินการ
              </Typography>
              <Typography variant="h3" fontWeight={500}>
                37
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                สถิติวันนี้
              </Typography>
              <Typography variant="h3" fontWeight={500}>
                15
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ mt: 4 }}>
        ดูรายละเอียดเพิ่มเติม
      </Button>
    </>
  )
}
