import { test, expect, Page } from '@playwright/test';

async function snap(page: Page, label: string) {
  await test.info().attach(label, { body: await page.screenshot(), contentType: 'image/png' });
}

test('tc_4000 | 캘린더 탭 진입', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await snap(page, '캘린더 탭 진입 화면');
  await expect(page.getByText('캘린더')).toBeVisible();
  await expect(page.locator('.calendar')).toBeVisible();
});

test('tc_4002 | 월 이동 - 이전 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  const beforeMonth = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '<' }).click();
  await snap(page, '이전 달 이동 후 헤더 확인');
  const afterMonth = await page.locator('.calendar-header').textContent();
  expect(beforeMonth).not.toBe(afterMonth);
});

test('tc_4003 | 월 이동 - 다음 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  const beforeMonth = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '>' }).click();
  await snap(page, '다음 달 이동 후 헤더 확인');
  const afterMonth = await page.locator('.calendar-header').textContent();
  expect(beforeMonth).not.toBe(afterMonth);
});

test('tc_4004 | 날짜 선택 - 미선택', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await snap(page, '날짜 미선택 상태 - 오늘 표시 및 일정 영역 확인');
  await expect(page.locator('.today')).toBeVisible();
  await expect(page.locator('.schedule-area')).toBeVisible();
});

test('tc_4005 | 날짜 선택 : 일정 있는 날짜', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('일정 있는 날 테스트');
  await page.getByRole('button', { name: '추가' }).click();
  await page.locator('.today').click();
  await snap(page, '일정 등록된 날짜 재선택 후 일정 노출 확인');
  await expect(page.getByText('일정 있는 날 테스트')).toBeVisible();
});

test('tc_4006 | 날짜 선택 : 일정 없는 날짜', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.getByRole('button', { name: '>' }).click();
  await page.locator('.calendar-day').first().click();
  await snap(page, '일정 없는 날짜 선택 - 빈 상태 문구 확인');
  await expect(page.getByText('일정이 없어요!')).toBeVisible();
});

test('tc_4007 | 날짜 선택 : 현재 날짜', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await snap(page, '오늘 날짜 선택 후 선택 상태 확인');
  await expect(page.locator('.today')).toHaveClass(/selected|active/);
  await expect(page.locator('.schedule-area')).toBeVisible();
});

test('tc_4008 | 오늘 날짜 표시 - 색상 구분 확인', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await snap(page, '오늘 날짜 강조 표시 확인');
  await expect(page.locator('.today')).toBeVisible();
  await expect(page.locator('.today')).toHaveClass(/today|current/);
});

test('tc_4009 | 오늘 날짜 표시 - 앱 재진입 후 유지 확인', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.getByRole('button', { name: '홈' }).click();
  await page.getByRole('button', { name: '캘린더' }).click();
  await snap(page, '홈 이동 후 재진입 시 오늘 날짜 유지 확인');
  await expect(page.locator('.today')).toBeVisible();
});

test('tc_4010 | 월 경계 이동 - 1월에서 이전 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  while (!(await page.locator('.calendar-header').textContent())?.includes('1월')) {
    await page.getByRole('button', { name: '<' }).click();
  }
  const beforeText = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '<' }).click();
  await snap(page, '1월에서 이전 달 이동 - 작년 12월로 전환 확인');
  const afterText = await page.locator('.calendar-header').textContent();
  expect(afterText).toContain('12월');
  expect(beforeText).not.toBe(afterText);
});

test('tc_4011 | 월 경계 이동 - 12월에서 다음 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  while (!(await page.locator('.calendar-header').textContent())?.includes('12월')) {
    await page.getByRole('button', { name: '>' }).click();
  }
  const beforeText = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '>' }).click();
  await snap(page, '12월에서 다음 달 이동 - 내년 1월로 전환 확인');
  const afterText = await page.locator('.calendar-header').textContent();
  expect(afterText).toContain('1월');
  expect(beforeText).not.toBe(afterText);
});

test('tc_4012 | 월 이동 - 월 이동 빠르게 연속 클릭', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: '>' }).click();
  }
  await snap(page, '연속 5회 클릭 후 캘린더 상태 확인');
  await expect(page.locator('.calendar')).toBeVisible();
  await expect(page.locator('.calendar-header')).toBeVisible();
});

test('tc_4013 | 월 이동 - 다른 탭 이동 후 복귀', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.getByRole('button', { name: '>' }).click();
  const monthText = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '홈' }).click();
  await page.getByRole('button', { name: '캘린더' }).click();
  await snap(page, '다른 탭 이동 후 복귀 - 이동했던 달 유지 확인');
  const afterText = await page.locator('.calendar-header').textContent();
  expect(afterText).toBe(monthText);
});

test('tc_4020 | 일정 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('테스트 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '일정 추가 후 목록 반영 확인');
  await expect(page.getByText('테스트 일정')).toBeVisible();
});

test('tc_4021 | 일정 추가 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill(' ');
  await snap(page, '공백 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_4022 | 일정 추가 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('!@#$%');
  await snap(page, '특수문자 입력 - 추가 버튼 disabled 확인');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_4023 | 일정 추가 : 1000자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('가'.repeat(1001));
  await snap(page, '1000자 초과 입력 - 에러 메시지 및 버튼 상태 확인');
  await expect(page.getByText('1000자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_4025 | 일정 추가 : 중복 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('첫 번째 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('두 번째 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '두 건 연속 추가 후 목록에 모두 반영 확인');
  await expect(page.getByText('첫 번째 일정')).toBeVisible();
  await expect(page.getByText('두 번째 일정')).toBeVisible();
});

test('tc_4024 | 일정 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('삭제할 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await snap(page, '삭제 전 - 일정 존재 확인');
  await page.getByText('삭제할 일정').locator('..').getByRole('button').click();
  await snap(page, '삭제 후 - 일정 제거 확인');
  await expect(page.getByText('삭제할 일정')).not.toBeVisible();
});