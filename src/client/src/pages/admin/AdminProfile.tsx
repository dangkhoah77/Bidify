import { useState } from 'react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/input/button'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/input/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/data-display/card'
import { Badge } from '@/components/ui/data-display/badge'
import { Textarea } from '@/components/ui/input/textarea'
import { Shield, Mail, MapPin, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { AdminHeader } from './AdminHeader'
export default function AdminProfile() {
	const { user, isLoading } = useAuth()
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<main className="container py-8">
					<div className="flex items-center justify-center h-64">
						<p className="text-muted-foreground">Đang tải...</p>
					</div>
				</main>
			</div>
		)
	}
	// Profile data from AuthContext
	const profileUser = {
		name: user?.firstName + ' ' + user?.lastName || 'Admin',
		email: user?.email || 'admin@example.com',
		address: user?.address || 'Chưa cập nhật',
		role: user?.role || 'ROLE ADMIN',
	}

	const handleUpdateProfile = () => {
		// TODO: Call API to update profile
		toast.success('Cập nhật thông tin thành công!')
	}

	return (
		<div className="min-h-screen bg-background">
			<AdminHeader />

			<main className="container py-8">
				<div className="max-w-4xl mx-auto">
					{/* Profile Header Card */}
					<Card className="mb-6">
						<CardContent className="pt-6">
							<div className="flex flex-col md:flex-row items-center gap-6">
								{/* Avatar */}
								<div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
									{profileUser.name.charAt(0)}
								</div>

								{/* User Info */}
								<div className="flex-1 text-center md:text-left">
									<h1 className="text-3xl font-bold mb-2">
										{profileUser.name}
									</h1>
									<div className="flex flex-col sm:flex-row items-center gap-3 text-muted-foreground mb-3">
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4" />
											<span>{profileUser.email}</span>
										</div>
										<div className="hidden sm:block">•</div>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4" />
											<span>{profileUser.address}</span>
										</div>
									</div>
									<Badge className="bg-gradient-to-r from-purple-500 to-indigo-600">
										<Shield className="h-3 w-3 mr-1" />
										Quản trị viên
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Profile Information Card */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<User className="h-5 w-5" />
								<CardTitle>Thông tin cá nhân</CardTitle>
							</div>
							<CardDescription>
								Quản lý thông tin tài khoản quản trị viên
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault()
									handleUpdateProfile()
								}}
								className="space-y-6"
							>
								{/* Name Fields */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">
											Họ và tên đệm
										</Label>
										<Input
											id="firstName"
											defaultValue={user?.firstName}
											placeholder="Nhập họ và tên đệm"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Tên</Label>
										<Input
											id="lastName"
											defaultValue={user?.lastName}
											placeholder="Nhập tên"
										/>
									</div>
								</div>

								{/* Email */}
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										defaultValue={profileUser.email}
										disabled
										className="bg-muted"
									/>
									<p className="text-xs text-muted-foreground">
										Email không thể thay đổi
									</p>
								</div>

								{/* Address */}
								<div className="space-y-2">
									<Label htmlFor="address">Địa chỉ</Label>
									<Textarea
										id="address"
										defaultValue={profileUser.address}
										placeholder="Nhập địa chỉ của bạn"
										rows={3}
									/>
								</div>

								{/* Divider */}
								<div className="border-t pt-6">
									<h3 className="text-lg font-semibold mb-4">
										Đổi mật khẩu
									</h3>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="currentPassword">
												Mật khẩu hiện tại
											</Label>
											<Input
												id="currentPassword"
												type="password"
												placeholder="Nhập mật khẩu hiện tại"
											/>
										</div>
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="newPassword">
													Mật khẩu mới
												</Label>
												<Input
													id="newPassword"
													type="password"
													placeholder="Nhập mật khẩu mới"
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-3 pt-4">
									<Button type="submit" className="px-8">
										Cập nhật thông tin
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
